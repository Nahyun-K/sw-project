library(dplyr)

data_2018 <- read.csv("C:/datamining_dataset/refinedataset/2018_노원구전체_이상치제거.csv",header=T)
#View(data_2018)

#nrow(data_2018%>% filter(일자%/%7 == 52)) #같은 주 끼리
#View(data_2018%>% filter(일자%/%7 == 52))

#대여소 번호들 전부 다 뽑기
대여소<- data_2018 %>% group_by(data_2018$대여소번호) %>% count(대여소번호)

station <- c(대여소$대여소번호)
#length(station)
station


#정류소별 7일 간격 총이용량

for (number in station){
  #
  data_2018_station <- filter(data_2018 , 대여소번호 == number)
  
  cnt=0
  use=0

  while(cnt<53){
    
    Count <- nrow(data_2018_station %>% filter(일자%/%7 == cnt))
    use <-c(use, Count) #같은 주 끼리 
    
    cnt = cnt+1
    
  }
  use<-use[-1]
  print(use)
  

  
}


#7일중 최댓값
for (number in station){
  #
  data_2018_station <- filter(data_2018 , 대여소번호 == number)
  
  cnt=0
  use=0

  
  while(cnt<53){
    
    Count <- data_2018_station %>% filter(일자%/%7 == cnt)#n주차
    
    #print(Count)
    
    date_use=0
    datee=0
    
    while(datee<7){
      Date<- nrow(Count %>% filter(일자%%7 == datee))#나머지가 0,1,2,3,4,5,6인 경우들의 합
      
      date_use<-c(date_use, Date)#하루에 몇번이용했는지

      datee=datee+1
      
    }
    
    date_use<-date_use[-1]
    #print(date_use)#7ㅇ일의 데이터를 볼수가 있다!
    
    max_use<-max(date_use)#제일 큰 값을7주의 대푯값으로 정한다

    
    use <-c(use, max_use) #주별로 출력
    
    cnt = cnt+1
    
  }
  use<-use[-1]
  #print(use)
  
  
  
}




#7일동안의 평균
for (number in station){
  #
  data_2018_station <- filter(data_2018 , 대여소번호 == number)
  
  cnt=0
  use=0
  
  
  while(cnt<53){
    
    Count <- data_2018_station %>% filter(일자%/%7 == cnt)#n주차
    
    #print(Count)
    
    date_use=0
    datee=0
    
    while(datee<7){
      Date<- nrow(Count %>% filter(일자%%7 == datee))#나머지가 0,1,2,3,4,5,6인 경우들의 합
      
      date_use<-c(date_use, Date)#하루에 몇번이용했는지
      
      datee=datee+1
      
    }
    
    date_use<-date_use[-1]
    #print(date_use)#7ㅇ일의 데이터를 볼수가 있다!
    
    mean_use<-mean(date_use)#제일 큰 값을7주의 대푯값으로 정한다
    mean_use<-round(mean_use, 3)
    
    use <-c(use, mean_use) #주별로 출력
    
    cnt = cnt+1
    
  }
  use<-use[-1]
  print(use)
  
  
  
}





setwd('C:/datamining_dataset/refinedataset/')
write.csv(aaa, file="2018_정류소별_일주일간_총이용량.csv", row.names = FALSE)
