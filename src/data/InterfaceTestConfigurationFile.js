export const getInterfaceTestConfigurationFile = (ip, port, username, password, ServerIP) => {
  return `#通过sftp方式获取人行二代或者农信银二代金融机构列表
sftp_ip=${ip}
sftp_port=${port}
sftp_user=${username}
sftp_password=${password}

######server ip######
ServerIP=${ServerIP}
ServerPort=10001
ServerPortRBC=40004
ServerPortRBCGM=40005
ServerPortPBC=20001
ServerPortPBC2G=20002
ServerPortNSS=40016
APIPassword=null
Timeout=30000
#####################

#############################################
#金电全国集中银行账户管理系统接入项目配置参数

# 服务ip
ip = 10.20.85.112
# 服务端口
port = 20002
# 服务口令
password = 11111111
#版本号
version = 0
# 机构编号
org.code = 666
# 服务器信息
server.info = infosec.netsign
#############################################

#是否自动检测服务可用性
servicetestistest=yes
#自动检测服务可用性时间间隔
servicetestinterval=10000
#连接分配模式
#1:动态集中分配
#2:静态平均分配
#3:静态集中分配
#4:静态轮询
connectionmode=1

######Server 加密公钥证书,der编码的cer文件
#ServerEncCert=/opt/infosec/NetSignServer20/NetSignServer/cert/rootcert/sheca.cer

######客户端ID######
#ClientID=12345678

#0-加密 1-不加密
CommunicateMode=1

######是否使用Socket池######
UsedConnectionPool=false

######Socket池最大连接数######
MaxConnections=5

#######压缩选项######
#true-对数据进行压缩 false-对数据不进行压缩
ZipMode=false

#需要压缩的数据的范围（最小值）
#以K为单位，比如200就表示
#数据从200K开始就要进行压缩处理
#在ZIPMode为true的时候，此设置有效
#如果用户不设置，则默认值是200
MinZipSize=200

#编码类型，用于对证书的主题和颁发者主题进行编码，必须和server端编码方式保存一致，
#不设置时使用系统默认编码
encoding=GBK

gc=0

##################################
#财政部专用参数
#制作数字信封传递证书的类型
#证书标识=0；证书颁发者;序列号=1；证书文件路径=2；证书Base64字符串=3
CertType=2
############### 是否使用数据库记录测试结果，isOpenRecord=true 测试结果写入数据库 isOpenRecord=false 不记录 ###################
isOpenRecord=false
############### 测试任务ID，SuiteId=netsign 默认使用接口自动化自生成的ID ，非netsign时 使用外部传入的任务ID ###################
SuiteId=netsign`
}
