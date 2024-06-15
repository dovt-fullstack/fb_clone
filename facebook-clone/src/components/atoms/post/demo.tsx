const huy = () => {
    return(
        <>
        <CreatePostBox />
        <div className="news-feed-posts">
          {concatOk?.map((post: any) => (
            <div className="news-feed-post" key={post._id}>
              <PostContainer
                postId={post._id}
                authorName={post.user[0]?.firstName + ' ' + post.user[0]?.lastName}
                time={post.createdAt}
                avatar={post.user[0]?.avatar}
                content={post.content}
                image={post.image}
                video={post.video}
                likes={post.like.length}
                comments={post.comments.length}
                onLike={() => likeThisPost(post._id, '1')}
                onTym={() => likeThisPost(post._id, '2')}
                onComment={() => toggleCommentBox(post._id)}
              />
              {openPostId === post._id && (
                <>
                  {dataCommentPost.map((data: any) => (
                    <div key={data._id} className="post-comment">
                      <img src={data.idUser.avatar} alt="" />
                      <div
                        className={`post-comment-text ${isEdit === data._id ? 'edit-mode' : ''}`}
                      >
                        <strong>{data.idUser.firstName}</strong>
                        <p style={{ color: isEdit === data._id ? 'red' : 'black' }}>{data.comment}</p>
                        {data.image && <img src={data.image} alt="Comment Image" />}
                        <Button onClick={() => removeCommentThisPost(data._id, post._id)}>
                          Remove
                        </Button>
                        <Button onClick={() => editCommentThisPost(data._id, post._id)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </>
    )
}