echo "What did you work on?"
read message
npm run build
git add .
git commit -a -m "${message}"
git push origin master