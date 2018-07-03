<template>
  <a :href="href" class="my-media-box" :class="'my-media-box_' + type" v-if="type === 'appmsg'">
    <div class="my-media-box__hd" v-if="type !== 'text'">
      <img class="my-media-box__thumb" :src="thumb" alt="">
    </div>
    <div class="my-media-box__bd">
      <h4 class="my-media-box__title" v-text="title"></h4>
      <p class="my-media-box__desc" v-text="description" v-for="description in descriptions"></p>
    </div>
  </a>
  <div class="my-media-box" :class="'my-media-box_' + type" v-else>
    <h4 class="my-media-box__title" v-text="title"></h4>
    <p class="my-media-box__desc" v-text="description" v-for="description in descriptions"></p>
    <slot name="box_ft"></slot>
  </div>
</template>

<script type="text/babel">
function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

export default {
  name: 'my-media-box',

  props: {
    type: {
      type: String,
      default: 'appmsg'
    },
    thumb: String,
    title: String,
    descriptions: Array,
    to: String
  },

  computed: {
    href () {
      let href

      if (this.$router && this.to) {
        const base = this.$router.history.base
        const resolved = this.$router.match(this.to)
        const fullPath = resolved.redirectedFrom || resolved.fullPath

        href = base ? cleanPath(base + fullPath) : fullPath
      } else {
        href = this.to
      }

      if (href && !this.added && this.$router) {
        this.$nextTick(() => {
          this.added = true
          this.$el.addEventListener('click', this.handleClick)
        })
      }
      return href
    }
  },

  methods: {
    handleClick ($event) {
      $event.preventDefault()
      this.$router.push(this.href)
    }
  }
}
</script>

<style>
.my-media-box {
    padding: 10px;
    position: relative;
    background-color: #fff;
}

.my-media-box:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    left: 15px
}

.my-media-box:first-child:before {
    display: none
}

a.my-media-box {
    color: #000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

a.my-media-box:active {
    background-color: #ececec
}

.my-media-box__title {
    font-weight: 400;
    font-size: 17px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
    margin-top: 0;
}

.my-media-box__desc {
    color: #999;
    font-size: 13px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2
}

.my-media-box__info {
    margin-top: 15px;
    padding-bottom: 5px;
    font-size: 13px;
    color: #cecece;
    line-height: 1em;
    list-style: none;
    overflow: hidden
}

.my-media-box__info__meta {
    float: left;
    padding-right: 1em
}

.my-media-box__info__meta_extra {
    padding-left: 1em;
    border-left: 1px solid #cecece
}

.my-media-box_text .my-media-box__title {
    margin-bottom: 8px
}

.my-media-box_appmsg {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center
}

.my-media-box_appmsg .my-media-box__hd {
    margin-right: .8em;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center
}

.my-media-box_appmsg .my-media-box__thumb {
    width: 100%;
    max-height: 100%;
    vertical-align: top
}

.my-media-box_appmsg .my-media-box__bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0
}

.my-media-box_small-appmsg {
    padding: 0
}

/*.my-media-box_small-appmsg .weui-cells {
    margin-top: 0
}

.my-media-box_small-appmsg .weui-cells:before {
    display: none
}*/
</style>
