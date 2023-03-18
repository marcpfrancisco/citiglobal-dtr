#!/bin/bash
target=$1

if [ "$target" == "frontend" ]
then
  cp frontend/src/environments/environment.prod.ts frontend/src/environments/environment.ts
fi

mvn clean install
rm citiglobal-prod/citiglobal-app.jar
mv backend/target/citiglobal-app.jar citiglobal-prod

cp frontend/src/environments/environment.test.ts frontend/src/environments/environment.ts
 