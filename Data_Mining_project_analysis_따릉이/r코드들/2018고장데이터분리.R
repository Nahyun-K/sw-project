library(dplyr)


library('lubridate')

library('tidyverse')


broken <- read.csv("C:/datamining_dataset/dataset/서울시 공공자전거 고장신고 내역_2015_2020.10.csv",header=T)
#View(broken)


yyyymmdd <- broken$등록일시

yyyymmdd <-substr(x= yyyymmdd, start = 1, stop=10)


Time <- broken$등록일시
Time <-substr(x= Time, start = 11, stop = 16)

broken<- cbind(broken, 등록날짜 = yyyymmdd, 등록시간 = Time)
#broken<- cbind(broken, 등록날짜 = yyyymmdd )

View(broken)


date<-broken$등록날짜

brokenn <- filter(broken , year(date)==2018)
View(brokenn)
