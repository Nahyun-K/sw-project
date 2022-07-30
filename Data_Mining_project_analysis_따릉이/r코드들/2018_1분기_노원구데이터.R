
library(dplyr)
info_place <- read.csv("C:/datamining_dataset/dataset/서울시_공공자전거_대여소_정보_20181129.csv",header=T)

nowon <- filter(info_place, 구분 == "노원구" )
nowon <- nowon %>%  
  mutate(대여소번호 = as.character(대여소번호))

nowon<-nowon[,c(2:8)]
#head(nowon)


#info_2018_123 <- read.csv("C:/datamining_dataset/서울특별시_공공자전거_대여이력_정보_2018년_1분기.csv",header=T)
#info_2018_4 <- read.csv("C:/datamining_dataset/서울특별시_공공자전거_대여이력_정보_2018년_2분기_1.csv",header=T)
#info_2018_5 <- read.csv("C:/datamining_dataset/서울특별시_공공자전거_대여이력_정보_2018년_2분기_2.csv",header=T)
#info_2018_6_1<- read.csv("C:/datamining_dataset/서울특별시_공공자전거_대여이력_정보_2018년_2분기_3.csv",header=T)
info_2018_6_2<- read.csv("C:/datamining_dataset/dataset/서울특별시_공공자전거_대여이력_정보_2018년_2분기_4.csv",header=T)


#파일 갯수 만큼 반복하기
info_2018_6_2 <- inner_join(nowon , info_2018_6_2, by = c("대여소번호" = "대여대여소번호"))



#각각 다 따로저장..
setwd('C:/datamining_dataset')
write.csv(info_2018_6_2, file="2018_1분기_노원구데이터5.csv", row.names = FALSE)

