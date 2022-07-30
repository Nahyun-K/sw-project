library(dplyr)
weather <- read.csv("C:/datamining_dataset/dataset/2018-2019날씨데이터.csv",header=T)
View(weather)

head(weather)

weather[is.na(weather)]<-0

View(weather)



setwd('C:/datamining_dataset')
write.csv(weather, file="2018-2019날씨데이터_결측치제거.csv", row.names = FALSE)


