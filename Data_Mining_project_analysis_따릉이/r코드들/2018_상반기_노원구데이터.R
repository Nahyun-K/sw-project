# 엑셀 여러개 합치기
library(dplyr)


data_2018_123 <- read.csv("C:/datamining_dataset/refinedataset/기본데이터들/2018_1분기_노원구데이터.csv",header=T)
data_2018_4 <- read.csv("C:/datamining_dataset/refinedataset/기본데이터들/2018_1분기_노원구데이터2.csv",header=T)
data_2018_5 <- read.csv("C:/datamining_dataset/refinedataset/기본데이터들/2018_1분기_노원구데이터3.csv",header=T)
data_2018_6_1 <- read.csv("C:/datamining_dataset/refinedataset/기본데이터들/2018_1분기_노원구데이터4.csv",header=T)
data_2018_6_2 <- read.csv("C:/datamining_dataset/refinedataset/기본데이터들/2018_1분기_노원구데이터5.csv",header=T)

group_all <- bind_rows(data_2018_123, data_2018_4,data_2018_5,data_2018_6_1,data_2018_6_2)


#csv로 저장
#setwd('C:/datamining_dataset/refinedataset')
#write.csv(group_all, file="2018_상반기_노원구전체데이터.csv", row.names = FALSE)



#데이터 분리
data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_상반기_노원구전체데이터.csv",header=T)


yyyymmdd <- data_2018$대여일시

yyyymmdd <-substr(x= yyyymmdd, start = 1, stop=10)


data_2018<- cbind(data_2018, 대여날짜 = yyyymmdd)


View(data_2018)

#setwd('C:/datamining_dataset')
#write.csv(data_2018, file="2018_상반기_노원구전체데이터_날짜분리추가.csv", row.names = FALSE)



#날짜끼리 합치기

library(dplyr)


data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_상반기_노원구전체데이터_날짜분리추가.csv",header=T)

#대여날짜 순으로 오름차순 정렬
sort_data<-data_2018[order(data_2018$대여날짜),]
head(sort_data)



#날짜끼리 합치는 코드

#sort_data %>% group_by(대여날짜) %>% summarise(일별대여횟수=n()) 굳이 이거안써도됨

data_2018_date <-sort_data %>% count(대여날짜)

names(data_2018_date)[2] <- c("하루이용횟수")


View(data_2018_date)



setwd('C:/datamining_dataset/refinedataset/')
write.csv(data_2018_date, file="2018_상반기_노원구일별데이터.csv", row.names = FALSE)





