
const Topic=require('../models/topics');
const User=require('../models/users');
const Questions=require('../models/questions');
class TopicsCtl{
   async find(ctx){
       //话题列表 分页+模糊查询功能(正则匹配)
       const {per_page =10}= ctx.query;
       const page=Math.max(ctx.query.page*1,1)-1;
       const perPage=Math.max(per_page *1,1);
       ctx.body=await Topic
       .find({ name:new RegExp(ctx.query.q) })
       .limit(perPage).skip(page*perPage);
   }
   async checkTopicExist(ctx,next){
    const topic=await Topic.findById(ctx.params.id);
    if(!topic){ctx.throw(404,'话题不存在')}
    await next();
   }
   async findById(ctx){
       const {fields =''}=ctx.query;
       const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+ f).join('');
       const topic=await Topic.findById(ctx.params.id).select(selectFields);
       ctx.body=topic;
   }
   async create(ctx){
       ctx.verifyParams({
           name:{type:'string',required:true},
           avatar_url:{type:'string',required:false},
           introduction:{type:'string',required:false}
       });
       const topic=await new Topic(ctx.request.body).save();
       ctx.body=topic;
   }
   async update(ctx){
       ctx.verifyParams({
        name:{type:'string',required:false},
        avatar_url:{type:'string',required:false},
        introduction:{type:'string',required:false}
       });
       const topic=await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body);
       ctx.body=topic;//更新前的topic
    }
    //获取关注话题的用户列表
    async listFollowerTopic(ctx){
        const users=await User.find({followingTopic:ctx.params.id});
        ctx.body=users;
    }
    //列出话题下的问题列表
    async listQuestions(ctx){
      const questions= await Questions.find({topics:ctx.params.id});
      ctx.body=questions;
    }
}

module.exports=new TopicsCtl();