install.packages('tidyverse')
library('tidyverse')
install.packages('lubridate')
library('lubridate')

library(dplyr)

data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구전체_날짜분리.csv",header=T)
View(data_2018)

date <- yday(data_2018$대여날짜)


data_2018<- cbind(data_2018, 일자 = date)
View(data_2018)

#저장
setwd('C:/datamining_dataset/refinedataset')
write.csv(data_2018, file="2018_노원구전체_날짜to숫자.csv", row.names = FALSE)
