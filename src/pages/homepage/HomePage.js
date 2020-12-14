import React, { useState, useEffect } from "react";
import "../../assets/style/App.css";
import { observer } from "mobx-react";
import axios from 'axios';
import { getPhotos,  getVotes, 
  getAllFavourites } from "../../utils/requests";
import ReactPaginate from "react-paginate";
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';
import countBy from 'lodash/countBy';

const _ = {filter, find, get, isEmpty, remove, countBy};

const PER_PAGE = 8;

class HomePage extends React.Component {

  constructor() {
    super()
    this.state = {
      photos: [],
      id: '',
      sub_id: '',
      votes: '',
      vote_up: '',
      vote_down: '',
      vote_state: null,
      vote: '',
      visible: false,
      push: null,
      favourites:[],
      pagination: {
        total: 0,
        limit : PER_PAGE,
        currentPage: 0        
      }
    }
  }

  handlePageClick = ({ selected: selectedPage }) => {
      // setCurrentPage(selectedPage);
      this.setState({pagination : {...this.state.pagination, currentPage:selectedPage}});
  }

  getAllFav = async () => {
    const favourites = await getAllFavourites();
    this.setState({
      favourites: favourites.data
    });
  };


  getSpecificFavourite = (fav_id) => {
    axios.get(`https://api.thecatapi.com/v1/favourites/${fav_id}`, 
    { headers: { "Content-Type": "application/json",
     "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
     }
     }
    )
      .then(res => {
        
        this.setState({
          favourites : [...this.state.favourites, res.data]
        });
      });
  }

  getAllVotes = async () => {
    const votes = await getVotes()
    const positive = votes.data.filter((vote) => {
      return vote.value == 1
    })

    const negative = votes.data.filter((vote) => {
      return vote.value == 0
    })

    this.setState({
      vote_up: positive.length,
      vote_down: negative.length
    })

    console.log("votes.data =====> ", votes.data);

    this.setState({
      votes: votes.data
    })
  };

  getAllPhotos = async (page) => {
  
    const response = await getPhotos(PER_PAGE, page);

    console.log("response : ", response);

    if(parseInt(_.get(response, "headers.pagination-page")) === 0){
      const pagination = {
        total: parseInt(_.get(response, "headers.pagination-count", 0)),
        limit: parseInt(_.get(response, "headers.pagination-limit", 0)),
        currentPage: parseInt(_.get(response, "headers.pagination-page", 0)),
      }
  
      this.state.pagination = {...pagination};
    }
    
    
    this.setState({
      photos: response.data
    });
  };

  componentDidMount() {
    this.setState({
      push: 1
    });

    
    this.getAllFav();
    this.getAllPhotos(0);
    this.getAllVotes();
  };

  componentDidUpdate(prevProps, prevState){
    if(prevState.favourites !== this.state.favourites) {
      this.setState();
    }

    console.log("pagination ====> ",prevState.pagination, this.state.pagination);

    if(prevState.pagination !== this.state.pagination) {
      const page = _.get(this.state.pagination, "currentPage", 1);
      this.getAllPhotos(page);
    }
  }

  handleFavSubmit = async (event, fav) => {
    event.preventDefault();

    await axios.post(`https://api.thecatapi.com/v1/favourites`, fav,
     { headers: { "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699" 
    } 
  }
    )
      .then(res => {
        if(_.get(res, "data.message", "FAIL") === "SUCCESS") {
          this.getSpecificFavourite(res.data.id);
        }

        localStorage.setItem('favId', res.data.id)
        this.setState({
          vote_state: 1,
          vote: this.state.vote
        })
      })
  }

  handleUnFavSubmit = (event, fav_id) => {
    event.preventDefault();
    // const favourite_id = localStorage.getItem('favId');
    const favourite_id = fav_id;

    axios.delete(`https://api.thecatapi.com/v1/favourites/${favourite_id}`,
     { headers: { "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
     } 
    }
    )
      .then(res => {
        localStorage.removeItem('favId');
        const removeFav = _.remove(this.state.favourites, {"id" : favourite_id});
        this.setState({
          vote_state: null,
          favourites : [...this.state.favourites]
        });
      });
  }

  handleVoteSubmit = (event, voteReq) => {
    event.preventDefault();

    let voteReqObj = voteReq;
    if(_.isEmpty(voteReq.sub_id)) {
      delete voteReq.sub_id;
      voteReqObj = voteReq;
    }
    
    axios.post(`https://api.thecatapi.com/v1/votes`, voteReqObj,
     { headers: { "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699" 
    } 
  }
    )
      .then(res => {
        this.getAllVotes();
        this.setState({
          push: 1
        });
      });
  }

  render() {

    const { pagination } = this.state;
    console.log("this.state.photos =====> ", this.state.photos);

    const photoList = this.state.photos.map(p => {
      let fav = {
        image_id: p.id
      }

      if(!_.isEmpty(p.sub_id)) {
        fav = {
          ...fav,
          sub_id: p.sub_id
        };
      }

      const voteUp = {
        image_id: p.id,
        sub_id: p.sub_id,
        value: true
      }

      const voteDown = {
        image_id: p.id,
        sub_id: p.sub_id,
        value: false
      }

      const voteObj = {};
      voteObj.image_id= p.id;
      
      

      const totalVoteUp = _.filter(this.state.votes, {...voteObj, value: 1});
      const totalVoteDown = _.filter(this.state.votes, {...voteObj, value: 0});

     

      const fadeIn = () => {
        let el = document.querySelector('.centered');

        if (!this.state.visible) {
          return el.classList.add('fadeIn'), el.classList.remove('fadeOut');
        } else {
          return el.classList.add('fadeOut'), el.classList.remove('fadeIn'), 
          el.classList.remove('fadeIn'), el.classList.remove('fadeIn');

        }
      }

      const fadeOut = () => {
        let el = document.querySelector('.centered');
        this.setState({
          visible: false
        })
        if (!this.state.visible) {
          return el.classList.add('fadeOut'), el.classList.remove('fadeIn')
        } else {
          return el.classList.add('fadeIn'), el.classList.remove('fadeOut')

        }
      }

      const is_fav = _.find(this.state.favourites, {...fav});

      let score = totalVoteUp.length - totalVoteDown.length;
      let scoreClass = 'score-blue';
      if(totalVoteUp.length > totalVoteDown.length) {
        scoreClass = 'score-blue';
      } else if(totalVoteUp.length < totalVoteDown.length) {
        scoreClass = 'score-red';
      } else {
        scoreClass = 'score-green';
      }

      return (
        <div className="col-md-6 col-xl-3 mt-5" key={p.id}>
          <div className="cat-card card-shadow">
            <div className="cat-card-top">
            
              <img className="cat-img" key={p.id} src={p.url} id="img_wrap" />
              
              {is_fav ?  
                <button type="button" className="fav-btn btn btn-primary btn-lg" 
                onClick={(e) => this.handleUnFavSubmit(e, is_fav.id)}>
                  <i className="fa fa-heart"></i>
                </button>                        
              : 
                <button type="button" className="fav-btn btn btn-primary btn-lg" 
                
                onClick={(e) => this.handleFavSubmit(e, fav)}>
                  <i className="fa fa-heart un-fa-heart"></i>
                </button>                        
              }
            </div>

            <div className="row mx-0">
              <div className="col">
                <span className={`total-score ${scoreClass}`}>Scores : {score}</span>
              </div>
            </div>

            <div className="row mx-0">
              <div className="col">
              
                <button type="button" className="btn btn-success btn-lg w-100 vote-up"
                 onClick={(e) => this.handleVoteSubmit(e, voteUp)}>Vote Up</button>
              </div>
              <div className="col">
               
                <button type="button" className="btn btn-danger btn-lg w-100" w-100 
                onClick={(e) => this.handleVoteSubmit(e, voteDown)}>Vote Down </button>
              </div>
            </div>
          </div>
        </div>
      )
    });

    const offset = pagination.currentPage * PER_PAGE;


    const pageCount = Math.ceil(pagination.total / PER_PAGE);

    return (
      <div className="container">
        <div className="row">
          {photoList}
        </div>
        <div className="row mx-0 pagination-wrapper">
              <div className="col">
                {
                  !_.isEmpty(photoList) && 
                  <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={pageCount}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                  />
                }
              </div>
        </div>
      </div>
    );
  }

}
export default observer(HomePage);