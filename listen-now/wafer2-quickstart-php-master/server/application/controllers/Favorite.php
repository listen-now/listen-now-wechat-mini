<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Favorite extends CI_Controller {
    public function index()
    {
        $this->load->database();
        parent::__construct();
       // mysqli_query("set names utf8");
        $update = $_GET['update'];

        if ($update == 'get_song'){
           $openid=$_GET['openid'];
           $fav_song=$this->db->query("SELECT json_string FROM fav_songs WHERE user_id='$openid'");
           $fav_song= $fav_song->result_array();
           $fav_song=stripslashes($fav_song);
           $fav_songs = json_decode($fav_song);
           //$fav_songs= $fav_song[0]['json_string'];
           $fav_songs=explode('!', $fav_songs); 
           $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success',
                    'fav_song'=>$fav_songs
                ]
            ]);
            return ;

        }


        if ($update == 'fav_song') {

            $openid=$_GET['openid'];
            $data['musicId']=$_GET['id'];
            $data['name']=$_GET['name'];
            $data['src']=$_GET['src'];
            $data['poster']=$_GET['poster'];
            $data['author']=$_GET['author'];


            $count=$this->db->query("SELECT count FROM fav_songs WHERE user_id='$openid'");
            $count=$count->result_array();
            $count=$count[0]['count'];
            
                $arr=json_encode($data);
                $arr = addslashes($arr);
               $this->db->query("UPDATE fav_songs SET json_string='$arr' WHERE user_id='$openid'");
                  $this->json([
                  'code' => $count,
                   'data' => [
                    'msg' => 'success',
                    'fav_song'=>$arr
                ]
            ]);return ;

            $fav_song=$this->db->query("SELECT json_string FROM fav_songs WHERE user_id='$openid'");
            //   $arr=json_encode($fav_song);
            //  $this->db->query("UPDATE fav_songs SET json_string='$arr' WHERE user_id='$openid'");
             //$fav_song=json_decode('$fav_song',true);
             $fav_song= $fav_song->result_array();
              $fav_song= $fav_song[0];
            
          //    $this->json([
          //       'code' => 1,
          //       'data' => [
          //           'msg' => 'success',
          //           'fav_song'=>$fav_song
          //       ]
          //   ]);
          //  return;
          // $fav_song= DB::row('fav_songs', ['*'], compact('openid'));
            // if($fav_song)
            //  {
            //     $arr=json_decode('$fav_song',true);
            //  }
            $total=$count;
            if( $fav_song!="")
            {        
                  $fav_songs =$fav_song['json_string'];  //修改键值对的值
                  $fav_songs=explode('!', $fav_songs); //将字符串变为数组
            //        $this->json([
            //     'code' => $count,
            //     'data' => [
            //         'msg' => 'success',
            //         'fav_song'=>$fav_songs
            //     ]
            // ]);return ;
                   $fav_songs[$total]=$data;
 
            }else{
                  $fav_songs=array(
                     0 => $data
                        );
            }
             $arr=json_encode($fav_songs);

            $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success',
                    'fav_song'=>$fav_songs
                ]
            ]);
            $count++;
            $arr=json_encode($fav_songs);

            $this->db->query("UPDATE fav_songs SET json_string='$arr',count=$count WHERE user_id='$openid'");
         
        }
       

            

    }}

