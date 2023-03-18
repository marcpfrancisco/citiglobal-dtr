#!/bin/bash
target=$1

if [ "$target" == "piams" ]
then
  cp frontend/src/environments/environment.prod.ts frontend/src/environments/environment.ts
fi

mvn clean install
rm piams-prod/piams-app.jar
mv backend/target/piams-app.jar piams-prod

cp frontend/src/environments/environment.test.ts frontend/src/environments/environment.ts
 