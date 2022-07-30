install.packages('tidyverse')
library('tidyverse')
install.packages('lubridate')
library('lubridate')


library(dplyr)



data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구전체_이상치제거.csv",header=T)
#View(data_2018)

broken_2018<-read.csv("C:/datamining_dataset/refinedataset/2018_고장데이터.csv",header=T)


data_broken_merge<-merge(data_2018,broken_2018, by.x = c("자전거번호","대여날짜"), by.y=c("자전거번호","등록날짜"))
View(data_broken_merge)





#시간부분 가져오기
start_time <- data_broken_merge$대여일시
start_time<- substr(x= start_time, start = 11, stop=16)
h<-regmatches(start_time, regexpr("[a-zA-Z0-9]+[:]",start_time))
h<-sub(":" ,"", h)
h<-as.numeric(h)

m<-regmatches(start_time, regexpr("[:][a-zA-Z0-9]+",start_time))
m<-sub(":" ,"", m)
m<-as.numeric(m)

#분으로 바꾸기

start_time_in_min <- h*60 + m
start_time_in_min


finish_time<-data_broken_merge$반납일시
finish_time<- substr(x= finish_time, start = 11, stop=16)

h<-regmatches(finish_time, regexpr("[a-zA-Z0-9]+[:]",finish_time))
h<-sub(":" ,"", h)
h<-as.numeric(h)

m<-regmatches(finish_time, regexpr("[:][a-zA-Z0-9]+",finish_time))
m<-sub(":" ,"", m)
m<-as.numeric(m)

#분으로 바꾸기
finish_time_in_min <- h*60 + m


broken_time <- data_broken_merge$등록시간

h<-regmatches(broken_time, regexpr("[a-zA-Z0-9]+[:]",broken_time))
h<-sub(":" ,"", h)
h<-as.numeric(h)

m<-regmatches(broken_time, regexpr("[:][a-zA-Z0-9]+",broken_time))
m<-sub(":" ,"", m)
m<-as.numeric(m)

#분으로바꾸기
broken_time_in_min <- h*60 + m



is_broken <- filter(data_broken_merge, start_time_in_min < broken_time_in_min & broken_time_in_min < finish_time_in_min)

View(is_broken)
