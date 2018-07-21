<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Collect_list extends CI_Controller
{
    public function index()
    {
        $this->load->database();
        parent::__construct();
        // mysqli_query("set names utf8");
        $update = $_GET['update'];

        if ($update == 'create_list') {
            $openid = $_GET['openid'];
            $name   = $_GET['list_name'];
         

           $name_list= $this->db->query("SELECT collect_lists FROM user_collect_lists_name where openid='$openid' ");
           $name_list= $name_list->result_array();
           $name_list= $name_list[0]['collect_lists'];
           $name_list=json_decode($name_list);
            //  $this->json([
            //     'code' => 1,
            //     'data' => [
            //         'msg' => 'success',
            //          'name_list'=>$name_list,
            //     ]
            // ]);return;
            for($i=0;$i<count($name_list);$i++)
            {
              
                if($name_list[$i]==$name)
                {
                    $this->json([
                        'code' => 0,
                        'data' => [
                            'msg' => '名字重复',

                        ]
                    ]);
                    return ;
            }
            }
           
               $this->db->query("INSERT INTO user_collect_lists_detail(openid,list_name) VALUES('$openid','$name') ");//插入detail里
            $name_list[count($name_list)]=$name;
          
          
            $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success',
                     'name_list'=>$name_list,
                ]
            ]);
             $name_list=json_encode($name_list,JSON_UNESCAPED_UNICODE); //中文不进行编码
           
            // $this->json([
            //     'code' => 1,
            //     'data' => [
            //         'msg' => 'success',
            //          'name_list'=>$name_list,
            //     ]
            // ]);
            // return;
            $this->db->query("UPDATE user_collect_lists_name SET collect_lists='$name_list' WHERE openid='$openid'");
          


        }

        if($update=='get_collect_list'){
           $openid = $_GET['openid'];
            
           $name_list= $this->db->query("SELECT collect_lists FROM user_collect_lists_name where openid='$openid' ");
           $name_list= $name_list->result_array();
           $name_list= $name_list[0]['collect_lists'];
           $name_list=json_decode($name_list);
 
            $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success',
                     'name_list'=>$name_list,
                ]
            ]);

        }


    if ($update == 'insert_song') {

            $openid=$_GET['openid'];
            $data['musicId']=$_GET['id'];
            $data['oper']=$_GET['oper'];
            $list_name=$_GET['list_name'];
            $flag=0;


            $id=$this->db->query("SELECT music_id FROM user_collect_lists_detail WHERE (openid='$openid' AND list_name='$list_name')");
            $id=$id->result_array();
            $id=$id[0]['music_id'];
            $id=json_decode($id);
        // $this->json([
        //     'flag' => $flag,
        //     'data' => [
        //         'msg' => 'success',
        //         'list'=>$id,
        //     ]
        // ]);
        // return;
            $arr=[];
            if($data['oper']!=1)
            {
                  if(sizeof($id)==0)
            {
                $arr=array(0=>$data['musicId']);
            }else
            {
                foreach($id as $key => $value) {
                    if($id[$key] == $data['musicId'])
                    {
                        $flag= 1;
                        break;       //无重复，添加
                    }
                }
                $arr=$id;
                if($flag==0)
                {
                    $arr[sizeof($arr)]=$data['musicId'];
                }

            }
            }else{
               $arr=$id;  //重复，不添加
            }
           

            $this->json([
                'flag' => $flag,
                'data' => [
                    'msg' => 'success',
                    'list'=>$arr
                ]
            ]);
            $arr=json_encode($arr);
            $this->db->query("UPDATE user_collect_lists_detail SET music_id='$arr' WHERE openid='$openid' AND list_name='$list_name'");
            return;
        }
        



        
        if($update=='song_delete')
        {
            $arr=$_GET['arr'];
            $openid=$_GET['openid'];
           
            $this->db->query("UPDATE fav_songs SET music_id='$arr' WHERE user_id='$openid'");
            $this->json([
              
                'data' => [
                    'msg' => 'success',
                    'list'=>$arr
                ]
            ]);
            return;
        }

    }}