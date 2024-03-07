setwd("C:/Users/t2r/Dropbox (ORNL)/HydroSource General/HFI Data model/Data")
list.files()

library(readxl)
taxon <- read_excel("HFI_taxonomy.xlsx",sheet=2)
View(taxon)
taxon$Part_Level[47]=3
part_col=taxon$Part_Level+2
taxon$Part_Name=taxon[,part_col]
for (i in 1:length(part_col)){
  taxon$Part_Name[i]=taxon[i,part_col[i]]
}
library(xlsx)

#write.xlsx(taxon,"HFI_taxonomy_2.xlsx")

#this loop is for generation of part-level feature tables from the sufficiency matrix. Some preprocessing is necessary. In the sufficiency matrix, you need to add the taxonomy ID to a column . 
#This may vary between sheets, making tables for the generator only involved using a pair of sheets in the matrix. To make tables for every part in a single run it might be easier to reformat the entire matrix into one sheet.

taxon <- read_excel("HFI_taxonomy_2.xlsx")


### mine info from sheet 6 in suff. martix into a part level info table

target=c("4.1.3.1","4.1.3.2","4.1.3.4","4.1.3.5","4.1.3.6")

for (j in 1:length(target)){


catalog_6 <- read_excel("C:/Users/t2r/Dropbox (ORNL)/HydroSource General/HFI Data model/Data/HFI - Data Catalog and Sufficiency Matrix Template modifyied.xlsx",sheet = 6)
colnames(catalog_6)=c("one","two","three","four")



related= catalog_6[grep(target[j], catalog_6$four), ]
related$original_row=grep(target[j], catalog_6$four)


df<- data.frame(matrix(ncol = 10, nrow = nrow(related)))
colnames(df)=c("Unique_ID","Part_ID","Part_name","Catalog_link_sheet","Catalog_link_column", "Catalog_link_row","Catalog_name","Data_source_link","Taxonomic_relation","Type")


df$Part_ID=related$four
df$Taxonomic_relation="Underneath"
df$Taxonomic_relation[which( df$Part_ID == target[j])]="Direct" 
df$Catalog_name=related$one
df$Part_name=""
for (i in 1:nrow(df)){
  df$Part_name[i]= taxon$Part_Name[which( taxon$Part_ID == df$Part_ID[i])] 
}

df$Catalog_link_sheet=6
df$Catalog_link_column=3
df$Catalog_link_row=related$original_row
df$Type="data"
df$Units=related$two

write.csv(df,paste0(gsub("\\.","_",paste0("asset_",target[j],"_sheet6")),".csv"),row.names = FALSE)

### mine info from suff matrix sheet 8 into a part level info table

catalog_8 <- read_excel("C:/Users/t2r/Dropbox (ORNL)/HydroSource General/HFI Data model/Data/HFI - Data Catalog and Sufficiency Matrix Template modifyied.xlsx",sheet = 8)
colnames(catalog_8)=c("one","two","three","four","five")


related= catalog_8[grep(target[j], catalog_8$five), ]
related$original_row=grep(target[j], catalog_8$five)


df<- data.frame(matrix(ncol = 10, nrow = nrow(related)))
colnames(df)=c("Unique_ID","Part_ID","Part_name","Catalog_link_sheet","Catalog_link_column", "Catalog_link_row","Catalog_name","Data_source_link","Taxonomic_relation","Type")


df$Part_ID=related$five
#the loop does not like this line when there are zero entries 
df$Taxonomic_relation="Underneath"
df$Taxonomic_relation[which( df$Part_ID == target[j])]="Direct" 
df$Catalog_name=related$one

for (i in 1:nrow(df)){
  df$Part_name[i]= taxon$Part_Name[which( taxon$Part_ID == df$Part_ID[i])] 
}
df$Catalog_link_sheet=8
df$Catalog_link_column=3
df$Catalog_link_row=related$original_row
df$Type="data"
df$Units=related$two


write.csv(df,paste0(gsub("\\.","_",paste0("asset_",target[j],"_sheet8")),".csv"),row.names = FALSE)

list.files()
#catalog location is manual entry (see sheet 6 code)

#combine both tables
df=read.csv(paste0(gsub("\\.","_",paste0("asset_",target[j],"_sheet8")),".csv"))
df1=read.csv(paste0(gsub("\\.","_",paste0("asset_",target[j],"_sheet6")),".csv"))
dim(df1)
df2=rbind(df,df1)
View(df2)
df2$Unique_ID=paste0(df2$Part_ID,"-",(seq(1,nrow(df2),1)))
df2=df2[order(df2[,2]),]
write.csv(df2,paste0(gsub("\\.","_",paste0("asset_",target[j],"_links")),".csv"),row.names = FALSE)
}





