import httpRequest from '@/utils/httpRequest'

const generalApi = {
	//通过父节点编号查询字典信息
	queryDictionaryByPCode(pcode,_callBack){
		httpRequest({
		  url: httpRequest.adornUrl(`/dictionary/pcode/${pcode}`),
		  method: 'get', 
		}).then(({data}) => {
		  if (data && data.code === 0) { 
			  //字典信息
		      typeof _callBack== "function" && _callBack(data.dictionary)
		  } else {
			this.$message.error(data.msg)
		  } 
		});
	} 
	
	
}



export default generalApi