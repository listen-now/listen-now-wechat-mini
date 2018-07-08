<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class fav extends CI_Controller {
    public function index()
    {
        mysqli_query('listen-now', "set names 'utf8'");
        $this->load->database();
       // mysqli_query("set names utf8");
        $update = $_GET['update'];

        if ($update == 'fav_song') {

            $openid=$_GET['openid'];
            $data['musicId']=$_GET['id'];
            $data['name']=$_GET['name'];
            $data['src']=$_GET['src'];
            $data['poster']=$_GET['poster'];
            $data['author']=$_GET['author'];

            $fav_song=$this->db->query("SELECT json_string FROM fav_songs WHERE user_id=$openid");
            $arr=json_decode($fav_song,true);
            $total=0;
            foreach($arr as $value){
                $total++;
            }
            $arr[total]=$data;

            $this->json([
                'code' => 1,
                'data' => [
                    'msg' => 'success',
                    'fav_song'=>$arr
                ]
            ]);
            $arr=json_encode($arr);
            $this->db->query("UPDATE fav_songs SET json_string='$arr' WHERE user_id='openid'");


            return;

        }


    }}

