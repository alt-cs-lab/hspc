#!/bin/bash

# from https://gist.github.com/mihow/9c7f559807069a03e302605691f85572
export $(grep -v '^#' .env | xargs)
#!/bin/bash

psql -h localhost -p $DB_PORT -d $DB_NAME -U $DB_USER