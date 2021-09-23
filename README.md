### just git push
commit
push to
 然后操作青云即可

### git
```
git push -u origin main
```

### cloud prd

```
yarn build
docker build -t data_yth_nginx:0.0.4 .
docker tag data_yth_nginx:0.0.4  10.1.1.128/library/data_yth_nginx:0.0.4

(
    docker login 10.1.1.128
    admin/Harbor12345
)
docker push 10.1.1.128/library/data_yth_nginx:0.0.4
```

# 容器云
```
http://10.1.1.129:30880/
suhe/Sh23321
```