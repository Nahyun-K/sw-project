library(dplyr)


broken_2018<- read.csv("C:/datamining_dataset/refinedataset/2018_노원구_고장예상.csv",header=T)
broken_2019<- read.csv("C:/datamining_dataset/refinedataset/2019_노원구_고장예상.csv",header=T)

broken <- bind_rows(broken_2018, broken_2019)

broken = broken[!duplicated(broken[,c('자전거번호','등록날짜')]),] # 변수명으로 제거
broken

bycicle<- substr(x= broken$자전거번호,  start = 5, stop=9)#숫자부분으로 비교하려고.

bycicle<-as.numeric(bycicle)


broken<- cbind(broken, 자전거 = bycicle)

#View(broken)


bike<- broken %>% group_by(broken$자전거) %>% count(자전거)

View(bike)


#개수가 2 이상인 데이터의 자전거 이름 알아보기
ddd <- filter(bike, n > 1 )

View(ddd)


broke_again_bike<-c(ddd$자전거)

temp=0

for (i in broke_again_bike){
  broke_again<-filter(broken, broken$자전거 ==  i )
  temp<-rbind(temp, broke_again)
  
}
temp<-temp[-1,]
View(temp)

setwd('C:/datamining_dataset/refinedataset/')
write.csv(temp, file="노원구_2번이상고장_진짜.csv", row.names = FALSE)

