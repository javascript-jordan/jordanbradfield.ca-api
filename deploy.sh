echo "What version is this?"
read version
git add .
git commit -a -m "Releasing version: ${version}"
git push origin master
git tag "${version}"
git push origin "${version}"
git push heroku master