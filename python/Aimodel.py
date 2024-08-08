from datasets import load_dataset
from transformers import BertTokenizer, TFBertForQuestionAnswering
import tensorflow as tf
import html

# Set the cache directory
cache_dir = "/media/victor/New Volume"

# Load the dataset and specify the cache directory
dataset = load_dataset("google-research-datasets/natural_questions", "default", cache_dir=cache_dir)
#Maybe i should use this also ds_coqa = load_dataset("stanfordnlp/coqa")

# Initialize the tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Adjust preprocessing based on actual dataset structure
def preprocess_function(examples):
    questions = examples['question']
    documents = [paragraph['long_answer_candidates'] for doc in examples['document'] for paragraph in doc['long_answer_candidates']]
    inputs = tokenizer(questions, documents, max_length=512, truncation=True, padding='max_length')
    return inputs

tokenized_datasets = dataset.map(preprocess_function, batched=True)

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
