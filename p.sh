#!/bin/bash

completedata="repo,key,,age,path\n"

input="p.txt"
n=0
while IFS= read -r var
do
	echo $var
fi
n=$n+1
done < "$input"

#echo $complete 


