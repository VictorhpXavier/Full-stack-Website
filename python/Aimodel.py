from datasets import load_dataset
from transformers import BertTokenizer, TFBertForQuestionAnswering
import tensorflow as tf
from bs4 import BeautifulSoup
import os
import pickle

# Set the dataset directory
cache_dir = "/media/victor/New Volume"
save_dir = "/media/victor/New Volume/processed_data"

# Load the dataset
dataset = load_dataset("google-research-datasets/natural_questions", "default", cache_dir=cache_dir)

# Initialize the tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Function to extract text from the HTML document
def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    return soup.get_text()

# Function to get the maximum token length needed
def get_max_length(examples):
    max_length = 0
    for i in range(len(examples['document'])):
        document_html = examples['document'][i]['html']
        document_text = extract_text_from_html(document_html)
        
        tokens = examples['document'][i]['tokens']
        
        if isinstance(tokens, dict):
            token_list = []
            for j in range(len(tokens['end_byte'])):
                token_dict = {
                    'token': tokens.get('token', [])[j],
                    'is_html': tokens.get('is_html', [])[j],
                    'start_byte': tokens.get('start_byte', [])[j],
                    'end_byte': tokens.get('end_byte', [])[j],
                }
                token_list.append(token_dict)
        
        # Create a token map
        token_map = {j: token['token'] for j, token in enumerate(token_list) if not token['is_html']}
        
        # Extract the long answer candidates
        candidates = examples['long_answer_candidates'][i]
        if isinstance(candidates, dict):
            candidates = [candidates]
        
        long_answers = []
        if isinstance(candidates, list):
            for candidate in candidates:
                if isinstance(candidate, dict):
                    start_tokens = candidate.get('start_token', [])
                    end_tokens = candidate.get('end_token', [])
                    for start_token, end_token in zip(start_tokens, end_tokens):
                        candidate_text = " ".join(str(token_map.get(j, '')) for j in range(start_token, end_token + 1))
                        long_answers.append(candidate_text)
        
        long_answers_text = " ".join(long_answers)
        questions = examples['question'][i]['text']
        long_answers_texts = [long_answers_text] * len(questions)
        
        # Get maximum length of tokenized input
        tokenized = tokenizer(
            questions, 
            long_answers_texts, 
            truncation=True, 
            padding='max_length', 
            max_length=1000
        )
        max_length = max(max_length, max(len(ids) for ids in tokenized['input_ids']))
    
    return max_length

# Define a function to preprocess the data with a given max_length
def preprocess_function(examples, max_length):
    long_answers = []
    for i in range(len(examples['document'])):
        try:
            document_html = examples['document'][i]['html']
            document_text = extract_text_from_html(document_html)
            
            tokens = examples['document'][i]['tokens']
            
            if isinstance(tokens, dict):
                token_list = []
                for j in range(len(tokens['end_byte'])):
                    token_dict = {
                        'token': tokens.get('token', [])[j],
                        'is_html': tokens.get('is_html', [])[j],
                        'start_byte': tokens.get('start_byte', [])[j],
                        'end_byte': tokens.get('end_byte', [])[j],
                    }
                    token_list.append(token_dict)
            
            # Create a token map
            token_map = {j: token['token'] for j, token in enumerate(token_list) if not token['is_html']}
            
            # Extract the long answer candidates
            candidates = examples['long_answer_candidates'][i]
            if isinstance(candidates, dict):
                candidates = [candidates]
            
            long_answers = []
            if isinstance(candidates, list):
                for candidate in candidates:
                    if isinstance(candidate, dict):
                        start_tokens = candidate.get('start_token', [])
                        end_tokens = candidate.get('end_token', [])
                        for start_token, end_token in zip(start_tokens, end_tokens):
                            candidate_text = " ".join(str(token_map.get(j, '')) for j in range(start_token, end_token + 1))
                            long_answers.append(candidate_text)
            
            long_answers_text = " ".join(long_answers)
            questions = examples['question'][i]['text']
            long_answers_texts = [long_answers_text] * len(questions)
            
            # Tokenization with the specific max_length
            tokenized = tokenizer(
                questions, 
                long_answers_texts, 
                truncation=True, 
                padding='max_length', 
                max_length=max_length
            )
            
            return tokenized
        except Exception as e:
            print(f"Error processing example {i}: {e}")
            continue

# Save intermediate results
def save_intermediate(dataset, filename):
    with open(filename, 'wb') as f:
        pickle.dump(dataset, f)

# Load intermediate results
def load_intermediate(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)

# Process the dataset in chunks
chunk_size = 1000

def process_in_chunks(dataset, chunk_size, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    # Determine max_length for the entire dataset
    sample = dataset['train'].select(range(10000))  # Use a subset for max_length calculation
    max_length = get_max_length(sample)
    print(f"Determined max_length: {max_length}")

    for start in range(0, len(dataset['train']), chunk_size):
        end = min(start + chunk_size, len(dataset['train']))
        chunk = dataset['train'].select(range(start, end))
        
        # Adjust max_length dynamically if needed
        try:
            tokenized_chunk = chunk.map(lambda examples: preprocess_function(examples, max_length), batched=True).filter(lambda x: x is not None)
            save_intermediate(tokenized_chunk, os.path.join(save_dir, f'tokenized_chunk_{start}.pkl'))
            print(f"Processed and saved chunk {start} to {end}")
        except Exception as e:
            print(f"Error processing chunk {start} to {end}: {e}")

# Process and save the dataset
process_in_chunks(dataset, chunk_size, save_dir)

# Load tokenized data from saved files
def load_all_tokenized_data(save_dir):
    tokenized_datasets = []
    for filename in os.listdir(save_dir):
        if filename.endswith('.pkl'):
            tokenized_datasets.append(load_intermediate(os.path.join(save_dir, filename)))
    return tokenized_datasets

tokenized_datasets = load_all_tokenized_data(save_dir)

# Prepare the dataset for TensorFlow
from transformers import DataCollatorWithPadding

data_collator = DataCollatorWithPadding(tokenizer)

def to_tf_dataset(dataset, shuffle=True, batch_size=8):
    dataset = dataset.with_format('tensorflow')
    tf_dataset = dataset.to_tf_dataset(
        columns=['input_ids', 'attention_mask'],
        label_cols=None,
        shuffle=shuffle,
        batch_size=batch_size,
        collate_fn=data_collator  # Use data collator
    )
    return tf_dataset

train_dataset = to_tf_dataset(tokenized_datasets['train'])
val_dataset = to_tf_dataset(tokenized_datasets['validation'], shuffle=False)

# Verify GPU availability
print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
# Ensure TensorFlow uses GPU
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

# Initialize the model
model = TFBertForQuestionAnswering.from_pretrained('bert-base-uncased')

# Compile the model
optimizer = tf.keras.optimizers.Adam(learning_rate=3e-5)
model.compile(optimizer=optimizer, loss=model.compute_loss)

# Train the model
model.fit(train_dataset, validation_data=val_dataset, epochs=3)
