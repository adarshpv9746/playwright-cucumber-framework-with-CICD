#!/bin/bash

rm -rf reports 
mkdir reports
cd reports
mkdir json && mkdir html && mkdir screenshots

case $1 in 
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

case $2 in 
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

case $3 in 
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

browser=$browser test_env=$test_env reporter=$reporter npm run testing

if [ $reporter == "cucumber" ]
then
    npm run cucumber-report
elif [ $reporter == "allure" ]
then
    npm run generate-allure
fi