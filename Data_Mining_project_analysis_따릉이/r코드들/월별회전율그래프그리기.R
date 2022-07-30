library(dplyr)
library('ggplot2')
cycle_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018노원구_월별회전율.csv",header=T)

cycle_2019 <- read.csv("C:/datamining_dataset/refinedataset/2019노원구_월별회전율.csv",header=T)

colnames(cycle_2019) = c("월","대여소번호","월평균회전율","월최대회전율")

#cycle_nowon<-rbind(cycle_2018,cycle_2019)


ggplot(data=cycle_2019, aes(x=대여소번호, y=월)) + geom_point(aes(size=월평균회전율))
ggplot(data=cycle_2019, aes(x=대여소번호, y=월)) + geom_point(aes(size=월최대회전율))

                                                        