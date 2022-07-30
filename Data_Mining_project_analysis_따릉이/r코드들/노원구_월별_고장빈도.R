

install.packages('lubridate')
library('lubridate')


install.packages('tidyverse')
library('tidyverse')


library(dplyr)


broken <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구_고장예상.csv",header=T)

broken_month<-broken$등록날짜


broken_month<-month(broken_month)


as.numeric(broken_month)

broken<- cbind(broken, 등록월 = broken_month)

View(broken)

hist(broken$등록월, breaks=12)


sampling <- broken[sample(nrow(broken), 10), ]
View(sampling)
hist(sampling$등록월)
