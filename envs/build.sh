#!/bin/bash

# --CLEANING FOLDERS--
echo CLEANING FOLDERS
rm -rf build || true
rm -rf build_dev || true
rm -rf build_uat || true
rm -rf build_prod || true

# --DEV BUILD--
echo COPYING DEV ENVS
cp ./envs/.env.dev ./.env

echo BUILDING
yarn build

echo RENAMING BUILD TO BUILD_DEV
mv build build_dev

# --UAT BUILD--
echo COPYING UAT ENVS
cp ./envs/.env.uat ./.env

echo BUILDING
yarn build

echo RENAMING BUILD TO BUILD_UAT
mv build build_uat

# --PROD BUILD--
echo COPYING PROD ENVS
cp ./envs/.env.prod ./.env

echo BUILDING
yarn build

echo RENAMING BUILD TO BUILD_PROD
mv build build_prod

# --RESTORING .env TO DEV--
cp ./envs/.env.dev ./.env

echo Finished! =)
