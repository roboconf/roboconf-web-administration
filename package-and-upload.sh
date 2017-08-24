#!/bin/bash

#
# This script should be invoked AFTER « gulp dist » was manually invoked.
# It does not run the tests or verify the lint. But it...
#
# 1. ... invokes Gulp to build the distribution.
# 2. ... makes a ZIP of the distribution.
# 3. ... uploads it to Bintray.
#


# Constants
readonly BINTRAY_URL="https://bintray.com/api/v1"
readonly DIRECTORY="target/dist"

readonly CONFIG="target/dev.config"
readonly BACKUP="target/dev.config.backup"



echo
echo "Verifying the parameters and the build directory..."
echo

if [ -z $1  ]; then
	echo "The version parameter is mandatory."
	echo "Usage: package-and-upload.sh <version>"
	echo "Use 'snapshot' for ANY snapshot version."
	exit 1
fi

if [ -d "$CONFIG" ]; then
	echo "$CONFIG cannot exist for releases and uploads!"
	echo "Renaming it to $BACKUP."
	mv $CONFIG $BACKUP || exit 1
fi



echo
echo "Compiling the project..."
echo

ZIP="roboconf-web-administration-$1.zip"
rm -f $ZIP
gulp embed



if [ -d "$BACKUP" ]; then
	
	echo
	echo "Restoring the development configuration..."
	echo
	
	mv $BACKUP $CONFIG || exit 1
	echo "Done."
fi



echo
echo "Zipping the content..."
echo

now=$(date +"%m/%d/%Y @ %H:%M:%S")
cd "$DIRECTORY" \
	&& echo "$now" > metadata.txt \
	&& zip -rq "../$ZIP" . \
	&& cd ..

echo "Done."



if [ "$1" == "snapshot" ]; then
	echo
	echo "Resetting the snapshot version..."
	echo

	curl -vvf -u${BINTRAY_USER}:${BINTRAY_API_KEY} \
		-X DELETE ${BINTRAY_URL}/packages/roboconf/roboconf-web-administration/archives/versions/snapshot

	echo "Done."
fi


echo
echo "Uploading the ZIP file to Bintray..."
echo

curl -X PUT -T $ZIP -u ${BINTRAY_USER}:${BINTRAY_API_KEY} \
	-H "X-Bintray-Package:archives" \
	-H "X-Bintray-Version:$1" \
	-H "X-Bintray-Publish:1" \
	-H "X-Bintray-Override:1" \
	-H "X-Bintray-Explode:0" \
	-# -o "/tmp/curl-output.txt" \
	${BINTRAY_URL}/content/roboconf/roboconf-web-administration/$1/

echo
echo "$(</tmp/curl-output.txt)"
echo

if [[ "$(</tmp/curl-output.txt)" != *success* ]]; then
	exit 1
fi
