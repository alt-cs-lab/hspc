# from https://gist.github.com/mihow/9c7f559807069a03e302605691f85572
set -x
export $(grep -v '^#' .env | xargs)

docker cp ./api/database/SchoolDirectoryCSV.csv ${DB_CONTAINER}:/schools.csv
cat ./api/database/create_database.sql | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME 
echo "copy Schools(SchoolName, AddressLine1, AddressLine2, City, \"State\", PostalCode, USDCode) FROM '/schools.csv' DELIMITER ',' CSV HEADER;" | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME
cat ./api/database/populate_test_data.sql | docker exec -i ${DB_CONTAINER} psql -U $DB_USER -d $DB_NAME
