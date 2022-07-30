#만들어놓은 노원구 날짜별 이용횟수와 날씨데이터 합치기
library(dplyr)


data_2018_firsthalf <- read.csv("C:/datamining_dataset/refinedataset/2018_상반기_노원구일별데이터.csv",header=T)
weather <-read.csv("C:/datamining_dataset/refinedataset/2018-2019날씨데이터_결측치제거.csv",header=T)
weather <-weather[,c(3:13)]
head(weather)



weather_join <- inner_join(data_2018_firsthalf , weather, by = c("대여날짜" = "일시"))

setwd('C:/datamining_dataset/refinedataset')
write.csv(weather_join, file="2018_상반기_노원구따릉이_일별이용횟수와_날씨데이터.csv", row.names = FALSE)
