#github的重制版，基本一样，没用路由和多了些注释而已

https://github.com/yanmengssss/Russia-Block-Reset-.git

#这里是没有打包过的，具体打包教程看我的博客

https://blog.csdn.net/m0_73459939/article/details/140742301

#博客教程:
https://blog.csdn.net/m0_73459939/article/details/140774406

#首先npm install 下载，
记得下载cnpm,因为electron用npm和pnpm无法下载electron

```sh
npm install
```


```sh
npm install cnpm
```



```sh
cnpm install electron --save-dev
```

打包为dist
```
npm run build
```

运行h5:
```
npm run dev
```


electron运行：
```
npm run start
```

electron运行和h5是互相独立的，但是得打包为dist才能运行electron。

打包electron为exe:
```
npm run exe-build 
```

