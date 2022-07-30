
library('tidyverse')

library('lubridate')

library(dplyr)


broken_again<- read.csv("C:/datamining_dataset/refinedataset/노원구_2번이상고장_진짜.csv",header=T)
View(broken_again)




yearr <- year(broken_again$등록날짜) 



broken_again<-cbind(broken_again, 년도 = yearr)
#View(broken_again)



#2018년도 날짜 계산

broke_again_2018<-filter(broken_again, broken_again$년도 ==  2018 )
#broke_again_2018

broke_again_2018$등록날짜

datee<- yday(broke_again_2018$등록날짜)

datee

broke_again_2018 <- cbind(broke_again_2018, 일자 = datee)
#View(broke_again_2018)


datee=0

#2019년도 날짜 계산

broke_again_2019<-filter(broken_again, broken_again$년도 ==  2019 )
#broke_again_2019

broke_again_2019$등록날짜

datee<- yday(broke_again_2019$등록날짜)+365

#datee

broke_again_2019 <- cbind(broke_again_2019, 일자 = datee)
#View(broke_again_2019)



#날짜 계산 완료된 데이터.
broken_again<-rbind(broke_again_2018, broke_again_2019)

View(broken_again)


broken_again<-arrange(broken_again, 자전거, 등록날짜)
View(broken_again)


setwd('C:/datamining_dataset/refinedataset/')
write.csv(broken_again, file="노원구_2번이상고장_일자_진짜.csv", row.names = FALSE)






################################################################

#같은 자전거끼리 고장기간 계산

broken_again<- read.csv("C:/datamining_dataset/refinedataset/노원구_2번이상고장_일자_진짜.csv",header=T)


View(broken_again)
broken_bike<- broken_again %>% group_by(broken_again$자전거) %>% count(자전거)
broken_bike_list<-c(broken_bike$자전거)#자전거들 각각 모음


mean_period_list=list()
mean_period_list
for (i in broken_bike_list){
  broke_again<-filter(broken_again, broken_again$자전거 == i )

  datechange <- unlist(broke_again[7])#일자리스트를 벡터로
  print(datechange)
  
  num=1
  temp=0
  while(num < length(datechange)){
    
    period <- (datechange[num+1] - datechange[num])
    
    #print(period)
    num = num+1
    
    
    temp<-c(temp, period)

    #print(temp)
  }
  temp<-temp[-1]
  #print(temp)
  
  mean_period<-mean(temp,na.rm = TRUE)#0을 제외하고 계산
  #print(mean_period)
  
  mean_period_list<-append(mean_period_list,mean_period)

}
print(mean_period_list)
mean_period_vector <- unlist(mean_period_list)#일자리스트를 벡터로

mean_period_vector <- round(mean_period_vector,3)
print(mean_period_vector)

normal<-mean_period_vector[which(7 < mean_period_vector)]
print(normal)
View(normal)

hist(normal)

setwd('C:/datamining_dataset/refinedataset/')
write.csv(normal, file="노원구_고장날짜간격.csv", row.names = FALSE)


hist(normal, breaks=20 ,main = "고장난 자전거가 다시 고장날때까지의 기간(날짜)")


mean_of_broken <- mean(normal)
mean_of_broken

summary(normal)

