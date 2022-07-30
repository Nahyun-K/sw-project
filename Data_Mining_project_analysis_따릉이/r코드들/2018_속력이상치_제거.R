library(dplyr)

data_2018_half1 <- read.csv("C:/datamining_dataset/refinedataset/2018_상반기_노원구전체데이터_날짜분리추가.csv",header=T)
data_2018_half2 <- read.csv("C:/datamining_dataset/refinedataset/2018_하반기_노원구전체데이터_날짜분리추가.csv",header=T)

#일년치로 데이터 합치기
data_2018 <- bind_rows(data_2018_half1,data_2018_half2)


setwd('C:/datamining_dataset/refinedataset')
write.csv(data_2018, file="2018_노원구전체_날짜분리.csv", row.names = FALSE)


####################################################################################################

library(dplyr)
data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구전체_날짜to숫자.csv",header=T)


#nrow(data_2018)


#이동시간이 0이라서 속도로 만들수 없는 데이터 삭제
data_2018 <-data_2018[!(data_2018$이용시간 == 0), ]
nrow(data_2018) #425075, 대략 170 개 정도 감소..


#속력구하기
speed <- data_2018$이용거리/data_2018$이용시간

data_2018<- cbind(data_2018, 평균속력 = speed)

#세계 신기록 가진 사람의 속력 이상이면, 이상치 ->제거시킴
data_2018 <-data_2018[!(data_2018$평균속력 > 2400), ]
#View(data_2018)#
nrow(data_2018)#422226(2000개 감소)


#10번반복해보기

cnt=0
low=0
up=0

while(cnt<100){

  sampling <- data_2018[sample(nrow(data_2018), 10000), ]
  #summary(sampling)

  #boxplot(sampling$평균속력)$states


  #boxplot베이스로 이상치 찾기 
  # 1분위수 계산
  Q1 = quantile(sampling$평균속력,probs = c(0.25),na.rm = TRUE)
  # 3분위수 계산
  Q3 = quantile(sampling$평균속력,probs = c(0.75),na.rm = TRUE)

  LC = Q1 - 1.5 * (Q3 - Q1) # 아래 울타리
  LC
  UC = Q3 + 1.5 * (Q3 - Q1) # 위 울타리
  UC
  
  low<-c(low,LC)
  up<-c(up,UC)
  
  #마지막에 나온 값이 전체 평균값

  cnt = cnt+1
}


#mean(low)
#mean(up)

#LC<- mean(low)
#UC<- mean(up)


LC = mean(low)
UC = mean(up)


LC
UC

#이상치 수치제거
data_2018 <-data_2018[!(data_2018$평균속력 < LC), ]
data_2018 <-data_2018[!(data_2018$평균속력 > UC), ]
nrow(data_2018)#408228로 대충 2만개정도 줄어들었다.

boxplot(data_2018$평균속력)$states

View(data_2018)


setwd('C:/datamining_dataset/refinedataset')
write.csv(data_2018, file="2018_노원구전체_이상치제거.csv", row.names = FALSE)
