library(dplyr)

library('ggplot2')

broke_2018<- read.csv("C:/datamining_dataset/refinedataset/2018_노원구_고장예상.csv",header=T)
broke_2019<- read.csv("C:/datamining_dataset/refinedataset/2019_노원구_고장예상.csv",header=T)

broke<- rbind(broke_2018,broke_2019)


#View(broke)

broken_type<- broke %>% group_by(broke$고장구분) %>% count(고장구분)

View(broken_type)

broken_type <- broken_type[,-1]
View(broken_type)



ggplot(broken_type, aes(고장구분, n))+geom_bar(stat='identity')

pie(broken_type$n,labels = broken_type$고장구분)
