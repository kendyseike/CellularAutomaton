#!/bin/bash

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
platform=$(echo $branch | sed -e 's/.*\(android\).*/\1/' -e 's/.*\(ios\).*/\1/')
version=$(echo $branch | sed -e 's/.*\([0-9].[0-9].[0-9]\).*/\1/')

if [ $platform = "ios" ]
then
    echo "Generating iOS App - Fastlane"
    cd ios
    fastlane ios appVersion:$version    
else
    echo "Generating Android App - Fastlane"
    cd android
    fastlane android appVersion:$version
fi
