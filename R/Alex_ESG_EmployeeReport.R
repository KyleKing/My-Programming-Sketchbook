library("tidyr")
library("devtools")
library("dplyr")

df <- data.frame(x = c("abc","abc","abc","abc","abc","qw","qwert","qwerty"),
                 y = c(5,4,6,7,8,3,2,4))

grepl("ab*", df$x)
!grepl("ab*", df$x)
which(!grepl("ab*", df$x))

# =================

setwd("~/Desktop")
dfEmp <- read.csv("EmployeesUpdated.csv")
colNames(dfEmp)
rowNames(dfEmp)
dim(dfEmp)

dfEmp$NewEmail <- paste0(trimws(dfEmp$First.Name), ".", trimws(dfEmp$Last.Name), "@mail.house.gov")
head(dfEmp$NewEmail)

rLegis <- grep(".*Legislative.*", dfEmp$Title, ignore.case=TRUE)
rPhone <- grep("^202.*", dfEmp$Phone)
# # Use "value=TRUE" (value instead of row index) and "unique()" to troubleshoot this expression:
# unique(grep("^202.*", dfEmp$Phone, value=TRUE))

# Combine both vectors into a single column, then sort before you use to filter dfEmp
rBoth <- sort(c(rLegis, rPhone))
View(table(rBoth))

# Print out quick summary:
print(paste("With 'Legis': ", length(rLegis), " with 202: ", length(rPhone), " total with either: ", length(unique(rBoth))))

# Filter by row numnber (all columns)
dfEmpEither <- dfEmp[unique(rBoth), ]
View(dfEmpEither)

# Write CSV output
write.csv(dfEmpEither, file="EmpEither.csv")

# # Another example, use "substr()" to get the area code and which to evaluate the row indices where that is True
# is202Code <- substring(dfEmp$Phone, 1, 3) == "202"
# dfPhone <- dfEmp[which( is202Code ), ]
# unique( as.numeric(substring(dfPhone$Phone, 1, 3)) )  # try replacing dfPhone with dfEmp


# Other useful commands: rbdind() and merge(). 

# rNonGovEmail <- grep(???.*mail.house.gov???, df$email)
# df <- df[!(rNonGovEmail), ]
