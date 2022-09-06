import spacy
import en_core_web_sm

def is_token_allowed(token):
    '''
        Only allow valid tokens which are not stop words
        and punctuation symbols.
    '''
    if (not token or
        token.is_stop or token.is_punct):
        return False
    return True

def preprocess_token(token):
    # Reduce token to its lowercase lemma form
    return token.lemma_.strip().lower()

def preprocess_sentence(sentence):
    nlp = spacy.load('en_core_web_sm')
    # python -m spacy download en_core_web_sm

    doc = nlp(sentence)

    complete_filtered_tokens = [preprocess_token(token)
        for token in doc if is_token_allowed(token)]
    return complete_filtered_tokens
