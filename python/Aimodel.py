from datasets import load_dataset
from transformers import BertTokenizer, TFBertForQuestionAnswering
import tensorflow as tf
from bs4 import BeautifulSoup

# Set the dataset directory
cache_dir = "/media/victor/New Volume"

# Load the dataset and specify the cache directory
dataset = load_dataset("google-research-datasets/natural_questions", "default", cache_dir=cache_dir)

# Initialize the tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

#Preprocess function esta a funcionar nao tocar

# Function to extract text from the HTML document
def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    return soup.get_text()

# Define a function to preprocess the data
def preprocess_function(examples):
    long_answers = []

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
        else:
            raise ValueError(f"Example {i}: The 'tokens' field is not formatted correctly. Actual structure: {tokens}")
        
        # Create a token map
        token_map = {j: token['token'] for j, token in enumerate(token_list) if not token['is_html']}
        
        # Extract the long answer candidates
        candidates = examples['long_answer_candidates'][i]
        
        # Transform the dictionary into a list if it's a dictionary
        if isinstance(candidates, dict):
            candidates = [candidates]
        
        if isinstance(candidates, list):
            for candidate in candidates:
                if isinstance(candidate, dict):
                    start_tokens = candidate.get('start_token', [])
                    end_tokens = candidate.get('end_token', [])
                    
                    if not isinstance(start_tokens, list) or not isinstance(end_tokens, list):
                        raise TypeError(f"Expected 'start_token' and 'end_token' to be lists, but got start_tokens: {type(start_tokens)}, end_tokens: {type(end_tokens)}")
                    
                    for start_token, end_token in zip(start_tokens, end_tokens):
                        if not isinstance(start_token, int) or not isinstance(end_token, int):
                            raise TypeError(f"Start token and end token must be integers, but got start_token: {type(start_token)}, end_token: {type(end_token)}")
                        
                        # Ensure token_map[j] is a string, and concatenate them properly
                        candidate_text = " ".join(str(token_map.get(j, '')) for j in range(start_token, end_token + 1))
                        long_answers.append(candidate_text)
                else:
                    raise TypeError(f"Expected 'candidate' to be a dictionary, but got {type(candidate)}")
        else:
            raise TypeError(f"Expected 'long_answer_candidates' to be a list, but got {type(candidates)}")
        
        long_answers_text = " ".join(long_answers)
        
        questions = examples['question'][i]['text']
        long_answers_texts = [long_answers_text] * len(questions)
        
        return tokenizer(
            questions, 
            long_answers_texts, 
            truncation=True, 
            padding='max_length', 
            max_length=1000  # Adjust based on your needs
        )    
#Preprocess function esta a funcionar nao tocar

#sample_data = dataset['train'].select([0])  # Select a small subset for testing
#processed_sample = preprocess_function(sample_data)
#print(processed_sample)
# Apply the preprocessing function to the dataset
tokenized_datasets = dataset.map(preprocess_function, batched=True)

# Check the structure of the tokenized dataset
print(tokenized_datasets)

# Prepare the dataset for TensorFlow
def to_tf_dataset(dataset, shuffle=True, batch_size=8):
    columns = ['input_ids', 'attention_mask']
    dataset = dataset.with_format('tensorflow')
    tf_dataset = dataset.to_tf_dataset(
        columns=columns,
        label_cols=None,
        shuffle=shuffle,
        batch_size=batch_size,
        collate_fn=tokenizer.pad
    )
    return tf_dataset

train_dataset = to_tf_dataset(tokenized_datasets['train'])
val_dataset = to_tf_dataset(tokenized_datasets['validation'], shuffle=False)

# Ensure TensorFlow uses GPU
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

# Verify GPU availability
print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))

# Initialize the model
model = TFBertForQuestionAnswering.from_pretrained('bert-base-uncased')

# Compile the model
optimizer = tf.keras.optimizers.Adam(learning_rate=3e-5)
model.compile(optimizer=optimizer, loss=model.compute_loss)

# Train the model
model.fit(train_dataset, validation_data=val_dataset, epochs=3)