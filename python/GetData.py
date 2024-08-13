from datasets import load_dataset, concatenate_datasets
from transformers import BertTokenizer
import pickle
import os

# Load dataset
cache_dir = "/media/victor/New Volume"
dataset = load_dataset('natural_questions', 'default', cache_dir=cache_dir)

# Initialize the tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def preprocess_function(examples):
    long_answers = []
    try:
        # Process each example
        for i in range(len(examples['document'])):
            document_html = examples['document'][i]['html']
            tokens = examples['document'][i]['tokens']
            
            if isinstance(tokens, dict):
                token_list = [
                    {
                        'token': tokens.get('token', [])[j],
                        'is_html': tokens.get('is_html', [])[j],
                        'start_byte': tokens.get('start_byte', [])[j],
                        'end_byte': tokens.get('end_byte', [])[j],
                    }
                    for j in range(len(tokens['end_byte']))
                ]
            
            # Create a token map
            token_map = {j: token['token'] for j, token in enumerate(token_list) if not token['is_html']}
            
            # Extract long answer candidates
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
                max_length=173
            )
            
            return tokenized
    except Exception as e:
        print(f"Error processing example: {e}")
        return {}

def save_intermediate(filename, data):
    with open(filename, 'wb') as f:
        pickle.dump(data, f)

def load_intermediate(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)
#Get first files
def process_and_save_chunks(dataset, chunk_size, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    num_examples = len(dataset['train'])
    for start in range(0, num_examples, chunk_size):
        end = min(start + chunk_size, num_examples)
        chunk = dataset['train'].select(range(start, end))
        
        # Apply preprocessing function
        tokenized_chunk = chunk.map(preprocess_function, batched=True, remove_columns=['document', 'long_answer_candidates'])
        
        # Save the processed chunk
        save_intermediate(os.path.join(save_dir, f'tokenized_chunk_{start}.pkl'), tokenized_chunk)
        print(f"Processed and saved chunk {start} to {end}")

#Get last file
#def process_and_save_chunks(dataset, chunk_size, save_dir):
#    if not os.path.exists(save_dir):
#        os.makedirs(save_dir)
#
#    num_examples = len(dataset['train'])
#    # Start from the last chunk and work backwards
#    for start in range(num_examples - chunk_size, -1, -chunk_size):
#        end = start + chunk_size
#        if start < 0:  # For the very first chunk (when start goes below 0)
#            start = 0
#
#        chunk = dataset['train'].select(range(start, end))
#
#        # Adjust max_length for the last chunk if it's smaller than chunk_size
#        current_max_length = min(chunk_size, len(chunk))
#
#        # Apply preprocessing function with the dynamic max_length
#        tokenized_chunk = chunk.map(
#            lambda examples: preprocess_function(examples, max_length=current_max_length),
#            batched=True
#        )
#
#        # Save the processed chunk
#        save_intermediate(os.path.join(save_dir, f'tokenized_chunk_{start}.pkl'), tokenized_chunk)
#        print(f"Processed and saved chunk {start} to {end}")
#        
#chunk_size = 173
# Set parameters and process the dataset
chunk_size = 512
save_dir = "/media/victor/New Volume/save_dir"
process_and_save_chunks(dataset, chunk_size, save_dir)

def load_all_tokenized_data(save_dir):
    tokenized_datasets = []
    for filename in os.listdir(save_dir):
        if filename.endswith('.pkl'):
            with open(os.path.join(save_dir, filename), 'rb') as f:
                tokenized_datasets.append(pickle.load(f))
    return concatenate_datasets(tokenized_datasets)

# Load all processed data
combined_dataset = load_all_tokenized_data(save_dir)