import tensorflow as tf
from transformers import TFBertForQuestionAnswering
import numpy as np
import pickle

# Load tokenized data
def load_tokenized_data(pkl_file):
    with open(pkl_file, 'rb') as f:
        data = pickle.load(f)
    return data

# Preprocess data types to ensure correct format
def preprocess_data_types(dataset):
    def ensure_list(x):
        if isinstance(x, int):
            return [x]  # Convert single integer to list
        elif isinstance(x, (list, np.ndarray)):
            return list(x)
        else:
            raise ValueError("Unexpected data type")

    def preprocess_example(example):
        # Convert single integers to lists of appropriate length
        input_ids = ensure_list(example.get('input_ids', []))
        token_type_ids = ensure_list(example.get('token_type_ids', []))
        attention_mask = ensure_list(example.get('attention_mask', []))

        # Handle empty lists for start and end positions
        if 'short_answers' in example and len(example['short_answers']) > 0:
            short_answer = example['short_answers'][0]
            start_token = short_answer.get('start_token', [0])[0]
            end_token = short_answer.get('end_token', [0])[0]
        else:
            start_token = 0
            end_token = 0

        return {
            'input_ids': input_ids,
            'attention_mask': attention_mask,
            'token_type_ids': token_type_ids,
            'start_positions': start_token,
            'end_positions': end_token
        }

    dataset = [preprocess_example(example) for example in dataset]
    return dataset

# Convert to TensorFlow Dataset
def to_tf_dataset_with_labels(dataset):
    def generator():
        for example in dataset:
            yield (
                {
                    'input_ids': tf.convert_to_tensor(example['input_ids'], dtype=tf.int32),
                    'attention_mask': tf.convert_to_tensor(example['attention_mask'], dtype=tf.int32),
                    'token_type_ids': tf.convert_to_tensor(example['token_type_ids'], dtype=tf.int32),
                },
                {
                    'start_positions': tf.convert_to_tensor(example['start_positions'], dtype=tf.int32),
                    'end_positions': tf.convert_to_tensor(example['end_positions'], dtype=tf.int32),
                }
            )

    tf_dataset = tf.data.Dataset.from_generator(
        generator,
        output_signature=(
            {
                'input_ids': tf.TensorSpec(shape=(512,), dtype=tf.int32),
                'attention_mask': tf.TensorSpec(shape=(512,), dtype=tf.int32),
                'token_type_ids': tf.TensorSpec(shape=(512,), dtype=tf.int32),
            },
            {
                'start_positions': tf.TensorSpec(shape=(), dtype=tf.int32),
                'end_positions': tf.TensorSpec(shape=(), dtype=tf.int32),
            }
        )
    )
    return tf_dataset.batch(8).shuffle(100)

# Main code
def main():
    # Load and preprocess tokenized data
    FinalpklFile = '/media/victor/New Volume/save_dir/combined_tokenized_data.pkl'
    combined_dataset = load_tokenized_data(FinalpklFile)

    # Print a sample to verify structure
    print("Sample data:", combined_dataset[0])  # Inspect the first example

    # Preprocess to ensure data types
    combined_dataset = preprocess_data_types(combined_dataset)
    
    # Convert to TensorFlow dataset
    train_dataset = to_tf_dataset_with_labels(combined_dataset)
    
    # Define the model
    model = TFBertForQuestionAnswering.from_pretrained('bert-base-uncased')

    # Compile the model
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=3e-5),
                  loss={'start_positions': tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                        'end_positions': tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)},
                  metrics=['accuracy'])

    # Train the model
    model.fit(train_dataset, epochs=3)

    # Save the trained model
    model.save('trained_model.h5')

if __name__ == "__main__":
    main()