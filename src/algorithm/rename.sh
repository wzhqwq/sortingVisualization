for f in *.js; do
  mv -- "$f" "$(basename -- "$f" .js).ts"
done