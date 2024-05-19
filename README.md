# CSV-Parse with PSQL

Generate a list of users and insert that user in psql.

# Build

1. run ``npm install`` to install the code
2. Create ``.env`` file with variable
   ``LOG_LEVEL=ALL
   PG_SQL_USER=roo
   PG_SQL_PASSWORD=***
   PG_SQL_HOST=127.0.0.1
   PG_SQL_PORT=5432
   PG_SQL_DATABASE=kelp
   ``
3. You can use ``examples/createUserEntries.ts`` to create users, to use this run
   ``npm run generate-csv``
4. Run ``npm run dev`` to start the application the at ``http://localhost:8080``

You can refer to ``psql-csv-parser.postman_collection.json`` for API Document.

