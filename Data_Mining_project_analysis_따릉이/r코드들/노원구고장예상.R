library(dplyr)



data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구전체_이상치제거.csv",header=T)
#View(data_2018)

broken_2018<-read.csv("C:/datamining_dataset/refinedataset/2018_고장데이터.csv",header=T)


data_broken_merge<-merge(data_2018,broken_2018, by.x = c("자전거번호","대여날짜"), by.y=c("자전거번호","등록날짜"))
View(data_broken_merge)


#고장데이터부분만 다시 가져오기
data_broken<-select(data_broken_merge,자전거번호, 등록일시, 고장구분, 대여날짜)
colnames(data_broken) = c("자전거번호", "등록일시", "고장구분","등록날짜")
View(data_broken)

#중복제거
data_broken = data_broken[-which(duplicated(data_broken)),]
View(data_broken)

setwd('C:/datamining_dataset/refinedataset/')
write.csv(data_broken, file="2018_노원구_고장예상.csv", row.names = FALSE)
