#2018-02-01 --> 32로 바꾸기 위해필요한 라이브러리들..
install.packages('tidyverse')
library('tidyverse')
install.packages('lubridate')
library('lubridate')

#기본라이브러리
library(dplyr)

data_2018 <- read.csv("C:/datamining_dataset/2018_노원구_전체.csv",header=T)


#2018-02-01 --> 32로 바꾸기
date <- yday(data_2018$대여날짜)
data_2018<- cbind(data_2018, 일자 = date)



#대여소 번호들 전부 다 뽑기
ddd<- data_2018 %>% group_by(data_2018$대여소번호) %>% count(대여소번호)


View(ddd)



station <- c(ddd$대여소번호)
#모든 대여수 의 대여소번호. 포문에 넣으면 알아서 다해줄것이다....
station
#포문 일단 나중에해보고...
#for




#대여소 하나 분석
d_1601 <- filter(data_2018, 대여소번호 == station[1] )

View(d_1601)
