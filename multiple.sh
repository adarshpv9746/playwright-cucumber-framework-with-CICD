#!/bin/bash

rm -rf reports 
mkdir reports
cd reports
mkdir json && mkdir html && mkdir screenshots
cd ..

case $1 in 
    "")
        csv_name='default-scenarios.csv'
    ;;
    *)
        csv_name=$1
    ;;
esac

case $2 in 
    'tst')
        test_env='tst'
    ;;
    'stg')
        test_env='stg'
    ;;
    'prd')
        test_env='prd'
    ;;
    *)
        test_env='tst'
esac

case $3 in 
    "chromium")
        browser='chromium';
    ;;
    "firefox")
        browser='firefox';
    ;;
    'webkit')
        browser='webkit';
    ;;
    *)
        browser='chromium';
    ;;
esac

case $4 in 
    'allure')
        reporter='allure';
    ;;
    'cucumber')
        reporter='cucumber';
    ;;
    *)
        reporter='cucumber';
    ;;
esac

csv="./suites/$csv_name"

if [ ! -e "$csv" ]; then
    echo "Error: $csv does not exist."
    exit 1
fi

browser=$browser test_env=$test_env reporter=$reporter csv_scenario=$csv npm run multi-sh

if [ $reporter == "cucumber" ]
then
    npm run cucumber-report && reporter=$reporter npm run send-report
elif [ $reporter == "allure" ]
then
    npm run generate-allure && npm run allure-report && reporter=$reporter npm run send-report
fi