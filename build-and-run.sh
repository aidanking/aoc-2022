#! /bin/bash
id=$1
name="day-$id"

echo "building and running $name"

echo "removing dist"
rm -rf dist

echo "building project"
npm run build

echo "copying test files"
cp "src/$name/test.txt" "dist/$name";
cp "src/$name/input.txt" "dist/$name";


echo "running file for $name"
node "dist/$name";