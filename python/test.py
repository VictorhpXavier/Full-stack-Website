from transformers import AutoTokenizer, AutoModelForQuestionAnswering, Trainer, TrainingArguments
from datasets import load_dataset

# Load dataset
cache_dir = "/media/victor/New Volume"

dataset = load_dataset('natural_questions', 'default', cache_dir=cache_dir)

