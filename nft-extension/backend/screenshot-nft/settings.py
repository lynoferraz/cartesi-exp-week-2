
# Cartesapp Framework settings

# Files with definitions to import
FILES = ['nft'] # * Required

# Index outputs in inspect indexer queries
INDEX_OUTPUTS = True

# Index inputs in inspect indexer queries
INDEX_INPUTS = True

# Path dir to database
STORAGE_PATH = 'data'

# Case insensitivity for like queries
CASE_INSENSITIVITY_LIKE = True

# List of endpoints to disable (useful for cascading)
DISABLED_ENDPOINTS = ['core.verify','core.operator_address','core.cartridge','core.cartridges','core.rule_tags']

# List of modules to disable outputs  (useful for cascading)
DISABLED_MODULE_OUTPUTS = ['core']
