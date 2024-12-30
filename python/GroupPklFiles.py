import os
import pickle
from datasets import concatenate_datasets, Dataset

save_dir = ""

#Get all pkl files to combine into a single file
def load_all_tokenized_data(save_dir):
    tokenized_datasets = []
    for filename in os.listdir(save_dir):
        if filename.endswith('.pkl'):
            with open(os.path.join(save_dir, filename), 'rb') as f:
                tokenized_datasets.append(pickle.load(f))
    return concatenate_datasets(tokenized_datasets)

# Load and combine all tokenized data
combined_dataset = load_all_tokenized_data(save_dir)

# Save the combined dataset as a single .pkl file
with open(os.path.join(save_dir, 'combined_tokenized_data.pkl'), 'wb') as f:
    pickle.dump(combined_dataset, f)

print("Combined dataset saved to 'combined_tokenized_data.pkl'")

#Count number of rows of each file
def load_all_tokenized_data(save_dir):
    total_rows = 0

    tokenized_datasets = []
    for filename in os.listdir(save_dir):
        if filename.endswith('.pkl'):
            with open(os.path.join(save_dir, filename), 'rb') as f:
                data = pickle.load(f)
                tokenized_datasets.append(data)
                total_rows += len(data)
                print(f"Added {len(data)} rows from {filename}. Total so far: {total_rows} rows.")
    return concatenate_datasets(tokenized_datasets)

combined_dataset = load_all_tokenized_data(save_dir)
#Count number of rows of final pkl file
for filename in os.listdir(save_dir):
    if filename == 'combined_tokenized_data.pkl':
        with open(os.path.join(save_dir, filename), 'rb') as f:
            data = pickle.load(f)
            print(f"{filename}: {len(data)} rows")