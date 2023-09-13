# from https://gist.github.com/mihow/9c7f559807069a03e302605691f85572
export $(grep -v '^#' .env | xargs)

docker cp ./database/SchoolDirectoryCSV.csv ${DB_CONTAINER}:/schools.csv
cat ./database/hspc_queries-psql.sql | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME 
echo "copy School(SchoolName, AddressLine1, AddressLine2, City, \"State\", PostalCode, USDCode) FROM '/schools.csv' DELIMITER ',' CSV HEADER;" | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME
cat ./database/hspc_testpopulate.sql | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME
