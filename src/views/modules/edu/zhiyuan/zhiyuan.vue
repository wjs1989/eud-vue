<template>
	<el-form ref="form" :model="form" label-width="80px" style="height: 100%; ">

		<el-tabs tab-position="left" style="min-height:500px; height: 100%;">
			<el-tab-pane label="考生信息">
				<el-form-item label="考生姓名:">
					<el-input v-model="form.name" style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="所在学校:">
					<el-input v-model="form.school" style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="所在班级:">
					<el-input v-model="form.grades" style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="家长一:">
					<el-input v-model="form.parent1"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="手机号:">
					<el-input v-model="form.teleNo1"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="家长二:">
					<el-input v-model="form.parent2"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="手机号:">
					<el-input v-model="form.teleNo2"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="备注:">
					<el-input type="textarea" v-model="form.remark" rows =5 style="width: 50%;"></el-input>
				</el-form-item>
				<!-- 	<el-form-item label="活动区域">
					<el-select v-model="form.region" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item> -->
			</el-tab-pane>
			<el-tab-pane label="考生成绩信息">
				<el-form-item label="语文:">
					<el-input type ="number" v-model="form.yuwen"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="数学:">
					<el-input type ="number" v-model="form.shuxue"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="英语:">
					<el-input type ="number" v-model="form.yingyu"style="width: 30%;"></el-input>
				</el-form-item>
				<el-form-item label="自选一:">
					<el-row :gutter="10">
						<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
							<el-select v-model="form.optionalSubjects1" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>
						<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
							<el-input type ="number" v-model="form.subjectsVaule1"style="width: 37.8%;"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="自选二:">
					<el-row :gutter="10">
						<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
							<el-select v-model="form.optionalSubjects2" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>
						<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
							<el-input type ="number" v-model="form.subjectsVaule2" style="width: 37.8%;"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="自选三:">
					<el-row :gutter="10">
						<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
							<el-select v-model="form.optionalSubjects3" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>
						<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
							<el-input type ="number" v-model="form.subjectsVaule3" style="width: 37.8%;"></el-input>
						</el-col>
					</el-row>
				</el-form-item> 
			</el-tab-pane>
			<el-tab-pane label="志愿偏好信息"> 
				<el-form-item label="学校层次">
					<el-radio-group v-model="form.schoolLevel"> 
						<el-radio v-for="item in schoolTypes"  :label="item.value">{{item.label}}</el-radio> 
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名次上下调整">
					<el-radio-group v-model="form.rankingAdjustment">
						<el-row :gutter="10">
							<el-col>
								<el-radio v-for="item in rankingAdjustments"  :label="item.value">{{item.label}}</el-radio> 
							</el-col>
						</el-row>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="地域选择">
					<el-row :gutter="10">

						<el-cascader placeholder="试试搜索：浙江" :options="cascaderOptions" filterable
							@change="cascaderChange" v-model="cascaderDefault"></el-cascader>

					</el-row>
					<el-row :gutter="10">
						<el-radio-group v-model="form.schoolType">
							<el-radio label="1">本科</el-radio>
							<el-radio label="2">专科</el-radio>
						</el-radio-group>
					</el-row>  
					<el-row :gutter="10">
						<el-form-item label="专业大类">
							<el-select v-model="optionalSubjects1" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-row>
					<el-row :gutter="10">
						<el-form-item label="专业小类">
							<el-select v-model="optionalSubjects1" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-row>
					<el-row :gutter="10">
						<el-form-item label="权重">
							<el-select v-model="optionalSubjects1" placeholder="请选择">
								<el-option v-for="item in optionalSubjects" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-row>
				</el-form-item>

			</el-tab-pane>
			<!-- <el-tab-pane label="定时任务补偿">
				<el-form-item label="特殊资源">
					<el-radio-group v-model="form.resource">
						<el-radio label="线上品牌商赞助"></el-radio>
						<el-radio label="线下场地免费"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="活动形式">
					<el-input type="textarea" v-model="form.desc"></el-input>
				</el-form-item>
			</el-tab-pane> -->
		</el-tabs>

		<el-form-item style="text-align: right;">
			<el-button type="primary" @click="onSubmit" :disabled = "isDisabled" >保存</el-button>
			<el-button>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					id: 0,
					name: '', //学生姓名
					school: '', //所在学校
					grades: '',//所在班级
					parent1: '',//家长1
					teleNo1: '',//联系方式1
					parent2: '',//家长2
					teleNo2: '',//联系方式2
					remark:'', //备注
					yuwen:'', //语文分数
					shuxue:'', //数学分数
					yingyu:'', //英语分数
					
					optionalSubjects1: '', //自选科目1
					subjectsVaule1: '',//自选科目分数1
					optionalSubjects2: '',//自选科目2
					subjectsVaule1: '',//自选科目分数2
					optionalSubjects3: '',//自选科目3
					subjectsVaule1: '',//自选科目分数3  
					schoolLevel:'0',//学校级别 0是不限
					rankingAdjustment:-1,//排名调整 -1是不限
					districtProvince:"", //区域选择省
					districtCity:"",//区域选择市区
					schoolType:"1",//学校类型 1本科 2专科
					
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					resource1: '',
					desc: ''
				},

				//自选科目选项  -begin
				optionalSubjects: [{
					value: '1',
					label: '政治'
				}],
				optionalSubjects1: '',
				optionalSubjects2: '',
				optionalSubjects3: '',
			    //自选科目选项  -end
	
				cascaderOptions: [{
					value: 'zj',
					label: '浙江',
					children: [{
						value: 'hz',
						label: '杭州'
					}, {
						value: 'nb',
						label: '宁波'
					}],
				}, {
					value: 'js',
					label: '江西',
					children: [{
						value: 'sr',
						label: '上饶'
					}, {
						value: 'nc',
						label: '南昌'
					}],
				}],
				cascaderDefault: ['js', 'nc'],
				//提交按钮是否禁用
				isDisabled : false,
				//学校级别
				schoolTypes:[{label:211,value:211}],
				
				//名次上下调整
				rankingAdjustments:[
					{label:500,value:500},
					{label:1000,value:1000},
					{label:2000,value:2000},
					{label:3000,value:3000},
					{label:5000,value:5000},
					{label:10000,value:10000},
					{label:20000,value:20000},
					{label:'不限',value:-1}
				]
			}
		}, 
		activated () {
			//初始化自选科目
		  this.initOptionalSubjects();
		  //初始化区域信息
		  this.initCascaderOptions();
		  //初始化学校等级
		  this.initSchoolTypes();
		},
		methods: {
			onSubmit() {
				this.isDisabled= true;
				this.$refs['form'].validate((valid) => {
				  if (valid) {
				    this.$http({
				      url: this.$http.adornUrl(`/edu/student/${!this.form.id ? 'save' : 'update'}`),
				      method: 'post',
				      data: this.$http.adornData(this.form)
				    }).then(({data}) => {
				      if (data && data.code === 0) {
						this.form.id  = data.id;
				        this.$message({
				          message: '操作成功',
				          type: 'success',
				          duration: 1500,
				          onClose: () => {
				            this.visible = false
				            this.$emit('refreshDataList')
				          }
				        })
				      } else {
				        this.$message.error(data.msg)
				      }
					  this.isDisabled= false;
				    })
				  }
				})
			},
			cascaderChange(e) {
				console.log(e[0]);
				console.log(e[1]);
				
				this.form.districtProvince = e[0]; //区域选择省
				this.form.districtCity = e[1];//区域选择市区
			},
			//初始化自选科目
			initOptionalSubjects(){
				var that = this;
				this.$generalApi.queryDictionaryByPCode("OPTIONAL_SUBJECTS",function(data){
					that.optionalSubjects=[];
					data.forEach((elment, index, array) => {
						that.optionalSubjects.push({
							value:elment.code,
							label: elment.name
						})
					}); 
				});  
			}, 
			//初始化区域信息
			initCascaderOptions(){ 
				var that = this;
				this.$http({
				  url: this.$http.adornUrl(`/district/tree`),
				  method: 'get', 
				}).then(({data}) => {
				  if (data && data.code === 0) { 
					  //区域信息 
				      that.cascaderOptions=data.district.children ; 
					   
				  } else {
					this.$message.error(data.msg)
				  } 
				});
			},
			//初始化学校等级
			initSchoolTypes(){ 
				var that = this;
				this.$generalApi.queryDictionaryByPCode("SCHOOL_TYPE",function(data){
					that.schoolTypes=[];
					data.forEach((elment, index, array) => {
						that.schoolTypes.push({
							value:elment.value,
							label: elment.name
						})
					}); 
				}); 
			}
			
		}
	}
</script>

<style>
</style>
